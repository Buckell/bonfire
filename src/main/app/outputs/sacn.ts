import { Worker } from 'node:worker_threads';
import path from 'path';
import UniverseProvider from '../../../app_shared/Channel/UniverseProvider';
import { RouteData } from '../../../app_shared/sacn';

type Route = {
    worker: Worker;
    sourceUniverse: number;
    destinationUniverse: number;
    destination: string;
    priority: number;
};

export default class sACN {
    universeProvider: UniverseProvider;

    routes: (Route | undefined)[] = [];

    framerate: number = 50;

    running: boolean = false;

    constructor(provider: UniverseProvider) {
        this.universeProvider = provider;
    }

    addRoute(data: RouteData): number {
        const { sourceUniverse, destinationUniverse, destination, priority } =
            data;

        const worker = new Worker(path.resolve(__dirname, 'sacn_worker.js'));

        let key = 0;

        while (this.routes[key] !== undefined) ++key;

        this.routes[key] = {
            worker,
            sourceUniverse,
            destinationUniverse,
            destination,
            priority,
        };

        worker.on('online', () => {
            worker.postMessage([
                'create',
                {
                    universe: destinationUniverse,
                    destination,
                },
            ]);
        });

        return key;
    }

    deleteRoute(id: number) {
        return new Promise((resolve, reject) => {
            const route = this.routes[id];

            if (route === undefined) {
                reject();
                return;
            }

            this.routes[id] = undefined;
            route.worker.postMessage('destroy');
            route.worker.terminate().then(resolve).catch(reject);
        });
    }

    editRoute(data: RouteData) {
        const route = this.routes[data.id];

        if (route === undefined) {
            return;
        }

        if (
            data.destinationUniverse !== route.destinationUniverse ||
            data.destination !== route.destination
        ) {
            route.worker.postMessage([
                'create',
                {
                    universe: data.destinationUniverse,
                    destination: data.destination,
                },
            ]);

            route.destinationUniverse = data.destinationUniverse;
            route.destination = data.destination;
        }

        route.sourceUniverse = data.sourceUniverse;
        route.priority = data.priority;
    }

    getRoutes(): (RouteData | undefined)[] {
        return this.routes.map((route, index): RouteData | undefined =>
            route === undefined
                ? undefined
                : {
                      id: index,
                      sourceUniverse: route.sourceUniverse,
                      destinationUniverse: route.destinationUniverse,
                      destination: route.destination,
                      priority: route.priority,
                  },
        );
    }

    dispatchSend() {
        this.routes.forEach((route) => {
            if (route === undefined) {
                return;
            }

            const { worker, sourceUniverse } = route;

            const universeData =
                this.universeProvider?.getUniverse(sourceUniverse);

            worker.postMessage([
                'dispatch',
                {
                    payload: universeData || Buffer.from([]),
                    priority: route.priority,
                },
            ]);
        });
    }

    async start() {
        const loop = async () => {
            this.running = true;

            // let lastTime = process.hrtime.bigint();

            // Decent approximation of framerate. Mostly stable but some
            // fluctuations. Maintains performance.

            const interval = 1000 / this.framerate;

            let expected = Date.now() + interval;
            let drift = 0;
            const step = () => {
                const dt = Date.now() - expected; // the drift (positive for overshooting)

                if (dt !== 0) {
                    drift = dt;
                }

                this.dispatchSend();

                const curInterval = 1000 / this.framerate;
                expected += curInterval;
                setTimeout(step, Math.max(0, curInterval - drift)); // take into account drift
            };

            setTimeout(step, interval);

            // setInterval(
            //     () => {
            //         ++count;
            //
            //         const curTime = process.hrtime.bigint();
            //         if (curTime - startTime >= 1000000000) {
            //             console.log(count);
            //             count = 0;
            //             startTime = curTime;
            //         }
            //
            //         this.dispatchSend();
            //     },
            //     Math.floor(1000 / this.framerate) / 2,
            // );
            // while (this.routes.length > 0) {
            //     const currentTime = process.hrtime.bigint();
            //
            //     if (currentTime - lastTime >= 1000000000 / this.framerate) {
            //         this.dispatchSend();
            //         lastTime = currentTime;
            //     }
            // }

            // this.running = false;
        };

        // Watchdog
        setInterval(() => {
            if (!this.running && this.routes.length > 0) {
                loop();
            }
        }, 5000);
    }
}
