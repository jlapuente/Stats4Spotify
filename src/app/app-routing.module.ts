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
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'graphs', component: GraficosComponent, canActivate: [AuthGuardService]},
  { path: 'receipt', component: ReceiptComponent, canActivate: [AuthGuardService]},
  { path: 'comp', component: ComparationComponent, canActivate: [AuthGuardService]},
  { path: 'history', component: HistorialComponent, canActivate: [AuthGuardService]},
  { path: 'playlist', component: PlayListComponent, canActivate: [AuthGuardService]},
  { path: 'albumtify', component: AlbumtifyComponent, canActivate: [AuthGuardService]},
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
