import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IsActiveMatchOptions, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ambiente } from '../environments/ambiente';
import { controlarRolagem } from './shared/rolagem';
import { Busca } from './shared/ui/busca';
import { Logo } from './shared/ui/logo';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Logo, Busca],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  /** "/" exato, mas com qualquer filtro de período na query string das URLs antigas (?periodo=mes&data=…). */
  protected readonly inicioAtivo: IsActiveMatchOptions = {
    paths: 'exact',
    queryParams: 'ignored',
    matrixParams: 'ignored',
    fragment: 'ignored',
  };
  /** Páginas de identidade visual e posts: ferramenta interna, fora do site publicado. */
  protected readonly comMarca = ambiente.fonte === 'api';

  constructor() {
    controlarRolagem();
  }
}
