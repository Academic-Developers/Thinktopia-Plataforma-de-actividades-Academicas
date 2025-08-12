import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainHeader } from '../main-header/main-header';
import { MainFooter } from '../main-footer/main-footer';

@Component({
  selector: 'app-main-layout-component',
  imports: [RouterOutlet,MainHeader, MainFooter],
  templateUrl: './main-layout-component.html',
  styleUrl: './main-layout-component.css'
})
export class MainLayoutComponent {

}