import path from 'path';
import fs from 'node:fs/promises';
import { archiveFolder, extract } from 'zip-lib';
import { SharedValue } from '../../shared';
import GADE from '../../gade';
import { SaveStatus } from './SaveStatus';
import { DIRECTORIES } from '../directories';
import { openWindow, windows } from '../../window';
import { ProjectData } from './ProjectData';
import { PlayMode } from '../../../app_shared/bonfire';

export default class ProjectHandler {
    projectName: SharedValue<string> = GADE.shared.use<string>(
        'Bonfire.Project.Name',
        'No Project',
    );

    projectPath: SharedValue<string> = GADE.shared.use<string>(
        'Bonfire.Project.Path',
        '',
    );

    saveStatus: SharedValue<SaveStatus> = GADE.shared.use<SaveStatus>(
        'Bonfire.Project.SaveStatus',
        SaveStatus.Created,
    );

    projects: SharedValue<ProjectData[]> = GADE.shared.use<ProjectData[]>(
        'Bonfire.Project.Projects',
        [],
    );

    projectCreationDate?: Date;

    projectCreateWindowId: number = -1;

    suppressWrite: boolean = false;

    dataStore: { [file: string]: { [key: string]: SharedValue<any> } } = {
        config: {},
    };

    constructor() {
        GADE.hooks.add(
            'Shared.Changed',
            'PROJECT_HANDLER',
            (id: string, newValue: any) => {
                if (
                    id === 'Bonfire.Project.Name' ||
                    id.startsWith('Bonfire.Project.Store')
                ) {
                    if (this.suppressWrite) {
                        this.suppressWrite = false;
                        return;
                    }

                    this.write();
                }
            },
        );

        GADE.register(
            'Bonfire.Project.PromptCreate',
            this.promptCreateProject.bind(this),
        );
        GADE.register('Bonfire.Project.Create', this.createProject.bind(this));
        GADE.register('Bonfire.Project.Save', this.save.bind(this));
        GADE.register('Bonfire.Project.Open', this.open.bind(this));

        this.setupProjectsHandler();

        const playModeStore = this.useDataStoreValue<PlayMode>(
            'config',
            'PlayMode',
            PlayMode.Live,
        );
        GADE.shared
            .use('Bonfire.PlayMode', PlayMode.Live)
            .onChange(
                'PROJECT_HANDLER_PLAYMODE',
                (newValue: PlayMode) => (playModeStore.value = newValue),
            );
    }

    useDataStoreValue<T>(file: string, key: string, initialValue: T) {
        if (this.dataStore[file] === undefined) {
            this.dataStore[file] = {};
        }

        const fileData: { [key: string]: SharedValue<any> } =
            this.dataStore[file];

        const fileDataValue = fileData[key];

        if (fileDataValue === undefined) {
            return (fileData[key] = GADE.shared.use<T>(
                `Bonfire.Project.Store[${file}][${key}]`,
                initialValue,
            ));
        }

        return fileDataValue;
    }

    setupProjectsHandler() {
        const projectsFilePath = path.resolve(
            DIRECTORIES.DATA,
            'projects.json',
        );

        fs.readFile(projectsFilePath).then(async (content) => {
            const data = JSON.parse(String(content));

            if (data.projects === undefined) {
                return;
            }

            this.projects.value = (
                await Promise.all(
                    data.projects.map(async (project: any) => {
                        let exists = true;

                        await fs.stat(project.path).catch(() => {
                            exists = false;
                        });

                        if (!exists) {
                            return null;
                        }

                        return project;
                    }),
                )
            )
                .filter((p: any) => p !== null)
                .map(
                    (project: any): ProjectData => ({
                        ...project,
                        creation: new Date(project.creation),
                        latestAccess: new Date(project.latestAccess),
                    }),
                );

            console.log('[BONFIRE] Projects manifest loaded.');
        });

        this.projects.onChange(
            'PROJECT_HANDLER_PROJECTS',
            (newValue: ProjectData[]) => {
                fs.writeFile(
                    projectsFilePath,
                    JSON.stringify({
                        projects: newValue.map((data) => ({
                            ...data,
                            creation: data.creation?.getTime(),
                            latestAccess: data.latestAccess?.getTime(),
                        })),
                    }),
                );
            },
        );
    }

    promptCreateProject() {
        this.projectCreateWindowId = openWindow('project/create', {
            width: 500,
            height: 500,
            noDevTools: true,
            resizable: false,
        });

        windows[this.projectCreateWindowId].on('close', () => {
            this.projectCreateWindowId = -1;
        });
    }

    async createProject(projectData: ProjectData) {
        if (this.projectCreateWindowId !== -1) {
            windows[this.projectCreateWindowId]?.close();
        }

        this.projectName.value = projectData.name;
        this.projectPath.value = path.resolve(projectData.path);

        this.projectCreationDate = new Date();

        await this.save();
        await this.load();
    }

    generateWriteInfo() {
        return {
            name: this.projectName.value,
            writeTimestamp: new Date().getTime(),
            creation: this.projectCreationDate?.getTime(),
        };
    }

    async write() {
        this.saveStatus.value = SaveStatus.Writing;

        await Promise.all([
            ...Object.entries(this.dataStore).map(([file, entries]) =>
                fs.writeFile(
                    path.resolve(DIRECTORIES.PROJECT_WORKING, `${file}.json`),
                    JSON.stringify(
                        Object.fromEntries(
                            Object.entries(entries).map(
                                ([key, sharedValue]) => [
                                    key,
                                    sharedValue.value,
                                ],
                            ),
                        ),
                    ),
                ),
            ),
            fs.writeFile(
                path.resolve(DIRECTORIES.PROJECT_WORKING, 'info.json'),
                JSON.stringify(this.generateWriteInfo()),
            ),
        ]).then(() => {
            this.saveStatus.value = SaveStatus.Unsaved;
        });
    }

    async read() {
        await fs
            .readFile(path.resolve(DIRECTORIES.PROJECT_WORKING, 'info.json'))
            .then((content) => {
                const data = JSON.parse(String(content));

                this.suppressWrite = true;
                this.projectName.value = data.name;
                this.projectCreationDate = new Date(data.creation);
            });

        await Promise.all(
            Object.entries(this.dataStore).map(([file, entries]) =>
                fs
                    .readFile(
                        path.resolve(
                            DIRECTORIES.PROJECT_WORKING,
                            `${file}.json`,
                        ),
                    )
                    .then((content) => {
                        const data = JSON.parse(String(content));

                        Object.entries(data).forEach(([key, value]) => {
                            if (entries[key] !== undefined) {
                                entries[key].value = value;
                            }
                        });
                    }),
            ),
        );
    }

    async save() {
        await this.write();

        if (this.projectPath.value) {
            this.saveStatus.value = SaveStatus.Saving;

            await archiveFolder(
                DIRECTORIES.PROJECT_WORKING,
                this.projectPath.value,
            )
                .then(() => {
                    this.saveStatus.value = SaveStatus.Saved;
                })
                .catch(console.error);
        }
    }

    async open(file: string) {
        if (path.extname(file) !== '.bonfire') {
            return;
        }

        await fs.stat(file).then(() => {
            this.projectPath.value = file;
        });

        if (this.projectPath.value === file) {
            await this.load();

            this.projects.value = [
                ...(this.projects.value || []).filter(
                    (project: ProjectData) =>
                        path.resolve(project.path) !==
                        path.resolve(this.projectPath.value || ''),
                ),
                {
                    name: this.projectName.value || '',
                    path: this.projectPath.value,
                    creation: this.projectCreationDate,
                    latestAccess: new Date(),
                },
            ];
        }
    }

    async load() {
        if (this.projectPath.value) {
            await extract(this.projectPath.value, DIRECTORIES.PROJECT_WORKING);
            await this.read();

            if (
                !this.projectPath.value ||
                !this.projectName.value ||
                !this.projectCreationDate
            ) {
                return;
            }

            this.saveStatus.value = SaveStatus.Saved;
        }
    }
}
