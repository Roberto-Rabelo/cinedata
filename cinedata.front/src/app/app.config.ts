import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import localePt from '@angular/common/locales/pt';

import { ambiente } from '../environments/ambiente';
import { routes } from './app.routes';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    // A rolagem fica com o App (rolagem.ts): trocar só a query (?uf=SP no mapa) não volta ao topo.
    provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling({ scrollPositionRestoration: 'disabled' })),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    // Site estático: o navegador reaproveita o HTML pré-renderizado e as respostas embutidas nele (transfer cache),
    // sem buscar de novo os JSON nem redesenhar a página. Na API não há HTML do servidor para hidratar.
    ...(ambiente.fonte === 'estatico' ? [provideClientHydration(withEventReplay())] : []),
  ],
};
