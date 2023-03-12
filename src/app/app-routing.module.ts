import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';
import { AlbumtifyComponent } from './albumtify/albumtify.component';
import { ComparationComponent } from './comparation/comparation.component';
import { GraficosComponent } from './graficos/graficos.component';
import { HistorialComponent } from './historial/historial.component';
import { HomeComponent } from './home/home.component';
import { AuthGuardService } from './integration/services/auth-guard.service.ts.guard';
import { PlayListComponent } from './play-list/play-list.component';
import { ReceiptComponent } from './receipt/receipt.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, pathMatch: 'full'},
  { path: 'about-us', component: AboutUsComponent , pathMatch: 'full'},
  { path: 'graphs', component: GraficosComponent, canActivate: [AuthGuardService], pathMatch: 'full'},
  { path: 'receipt', component: ReceiptComponent, canActivate: [AuthGuardService], pathMatch: 'full'},
  { path: 'comp', component: ComparationComponent, canActivate: [AuthGuardService], pathMatch: 'full'},
  { path: 'history', component: HistorialComponent, canActivate: [AuthGuardService], pathMatch: 'full'},
  { path: 'playlist', component: PlayListComponent, canActivate: [AuthGuardService], pathMatch: 'full'},
  { path: 'albumtify', component: AlbumtifyComponent, canActivate: [AuthGuardService], pathMatch: 'full'},
  // { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
