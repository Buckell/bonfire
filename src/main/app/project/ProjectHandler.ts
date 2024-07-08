import path from 'path';
import fs from 'node:fs/promises';
import { SharedValue } from '../../shared';
import GADE from '../../gade';
import { SaveStatus } from './SaveStatus';
import { archiveFolder } from 'zip-lib';
import { DIRECTORIES } from '../directories';
import { openWindow, windows } from '../../window';
import { ProjectData } from './ProjectData';

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

    projectCreateWindowId: number = -1;

    constructor() {
        GADE.hooks.add(
            'Shared.Changed',
            'PROJECT_HANDLER',
            (id: string, newValue: any) => {
                if (id === 'Bonfire.Project.Name') {
                    this.write();
                }
            },
        );

        GADE.register('Bonfire.Project.PromptCreate', this.promptCreateProject.bind(this));
        GADE.register('Bonfire.Project.Create', this.createProject.bind(this));
        GADE.register('Bonfire.Project.Save', this.save.bind(this));
    }

    promptCreateProject() {
        this.projectCreateWindowId = openWindow(
            'project/create',
            {
                width: 500,
                height: 500,
                noDevTools: true,
                resizable: false,
            },
        );

        windows[this.projectCreateWindowId].on('close', () => {
            this.projectCreateWindowId = -1;
        });
    }

    async createProject(projectData: ProjectData) {
        if (this.projectCreateWindowId !== -1) {
            windows[this.projectCreateWindowId]?.close();
        }

        this.projectName.value = projectData.name;
        this.projectPath.value = projectData.path;

        await this.save();
    }

    generateWriteInfo() {
        return {
            name: this.projectName.value,
            writeTimestamp: new Date().getTime(),
        };
    }

    async write() {
        this.saveStatus.value = SaveStatus.Writing;

        await Promise.all([
            fs.writeFile(
                path.resolve(DIRECTORIES.PROJECT_WORKING, 'info.json'),
                JSON.stringify(this.generateWriteInfo()),
            )
        ]).then(() => {
            this.saveStatus.value = SaveStatus.Unsaved;
        });
    }

    async save() {
        await this.write();

        if (this.projectPath.value) {
            this.saveStatus.value = SaveStatus.Saving;

            await archiveFolder(DIRECTORIES.PROJECT_WORKING, this.projectPath.value).then(() => {
                this.saveStatus.value = SaveStatus.Saved;
            }).catch(console.error);
        }
    }

    load() {

    }
}
