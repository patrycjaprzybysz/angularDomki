import { Component, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-accomo',
  templateUrl: './accomo.component.html',
  styleUrls: ['./accomo.component.css']
})
export class AccomoComponent {
  showReservationForm: boolean = false;
  totalCost: number = 0;
  reservationMessage: string = '';

  adults: number = 0;
  children: number = 0;
  startDate: Date | null = null;
  endDate: Date | null = null;
  email: string = '';

  constructor(private http: HttpClient) {}

  @HostListener('document:click', ['$event'])
  closeReservationMessage(event: MouseEvent) {
    if (this.reservationMessage && !this.isClickInsideComponent(event)) {
      this.reservationMessage = '';
    }
  }

  isClickInsideComponent(event: MouseEvent): boolean {
    const alertOverlay = document.querySelector('.alert-overlay');
    const reservationForm = document.querySelector('.reservation-form');
    if (alertOverlay && reservationForm) {
      return alertOverlay.contains(event.target as Node) || 
             reservationForm.contains(event.target as Node);
    }
    return false;
  }

  toggleReservationForm() {
    this.showReservationForm = !this.showReservationForm;
  }

  reserveStay() {
    const reservationData = {
      date_start: this.startDate,
      date_end: this.endDate,
      email: this.email,
      children: this.children,
      adults: this.adults
    };
  
    this.http.post('http://localhost:5995/api/domki/checkavailability', reservationData)
      .subscribe(
        (response: any) => {
          this.addReservation(reservationData);
        },
        (error) => {
          console.error('Sprawdzenie dostępności nie powiodło się:', error);
          this.showErrorMessage();
        }
      );
  }
  
  addReservation(reservationData: any) {
    this.http.post('http://localhost:5995/api/domki/addreservation', reservationData)
      .subscribe(
        (response: any) => {
          console.log('Reservation successful:', response);
          this.showSuccessMessage();
        },
        (error) => {
          console.error('Reservation failed:', error);
          this.showErrorMessage();
        }
      );
  }

  showSuccessMessage() {
    this.reservationMessage = 'Rezerwacja udana!';
  }

  showErrorMessage() {
    this.reservationMessage = 'Niestety, wystąpił problem podczas rezerwacji. Spróbuj ponownie.';
  }
}
