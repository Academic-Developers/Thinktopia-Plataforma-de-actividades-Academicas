import { Component,OnInit} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Features,Testimonial } from  '../../../../models/home-models/home-models';
import { HomeService } from '../../../../services/home/home.service';

@Component({
  selector: 'app-home',
  imports: [RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  features: Features[] = [];
  testimonials: Testimonial[] = [];

  constructor(private homeService:HomeService) {}

  ngOnInit():void {
      this.homeService.getFeatures().subscribe({
      next: (data) => (this.features = data),
      error: (err) => console.error('Error cargando features', err),
    });

    this.homeService.getTestimonials().subscribe({
      next: (data) => (this.testimonials = data),
      error: (err) => console.error('Error cargando testimonials', err),
    });
}
}
