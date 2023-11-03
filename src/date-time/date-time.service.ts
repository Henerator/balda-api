import { Injectable } from '@nestjs/common';

@Injectable()
export class DateTimeService {
  addDays(date: Date, days: number): Date {
    const changedDate = new Date(date);
    changedDate.setDate(changedDate.getDate() + days);
    return changedDate;
  }
}
