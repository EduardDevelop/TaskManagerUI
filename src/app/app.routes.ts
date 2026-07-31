import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/tasks/containers/task-page/task-page.component').then(
        (m) => m.TaskPageComponent,
      ),
  },
];
