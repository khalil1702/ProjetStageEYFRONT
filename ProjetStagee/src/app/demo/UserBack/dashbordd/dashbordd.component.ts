import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-dashbordd',
  templateUrl: './dashbordd.component.html',
  styleUrls: ['./dashbordd.component.scss']
})
export class DashborddComponent {
  powerBIUrl!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    // 🔁 Remplace ce lien par ton lien Power BI
    const url = 'https://go.microsoft.com/fwlink/?linkid=2153590https://app.powerbi.com/reportEmbed?reportId=6bc610ed-606f-45bf-bf67-8a4ed7ba94cd&autoAuth=true&ctid=604f1a96-cbe8-43f8-abbf-f8eaf5d85730';
    this.powerBIUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
