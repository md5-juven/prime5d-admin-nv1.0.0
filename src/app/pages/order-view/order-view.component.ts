import { Component } from '@angular/core';
import { FinalProduct, ORDERS } from '../../model/orders';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';
import { UserService } from '../../services/user.service';
import { userE_DTO, userRegs } from '../../model/user';
import { data } from 'jquery';
import { Bank } from 'src/app/model/bank';

@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.css']
})
export class OrderViewComponent {
  displayedColumns: string[] = ['name', 'mrp', 'quantity', 'total_mrp', 'dic_value', 'gst', 'tax_value', 'gross_value', 'disc_price'];
  productData: FinalProduct[] = [];
  orderDetails!: ORDERS;
  total_mrp: number = 0;
  total_paid: number = 0;
  discount: number = 0;
  orderId?: string;
  userDetails: userE_DTO[] = [];
  loader: boolean = true
  date: any;
  gross: any;
  tax: any;
  taxValue5: number = 0;
  taxValue12: number = 0;
  taxValue18: number = 0;
  taxValue28: number = 0;
  grossValue5: number = 0;
  grossValue12: number = 0;
  grossValue18: number = 0;
  grossValue28: number = 0;
  totalTaxValue: number = 0;
  totalGrossValue: number = 0;
  amountInWords: any;
  name: string = '';
  bankDetails: Bank = {};





  constructor(private order: OrderService, private rout: ActivatedRoute, private user: UserService) { }



  ngOnInit(): void {
    this.rout.paramMap.subscribe(data => {
      this.orderId = data.get('id') ?? undefined;
    })
    if (this.orderId != null && this.orderId != undefined) {
      this.order.getOrderByID(this.orderId).subscribe({
        next: data => {
          this.orderDetails = data;
          this.productData = this.orderDetails.productList!;
          this.total_paid = this.orderDetails.total_amount!;
          this.total_mrp = this.orderDetails.total_mrp!;
          this.discount = this.total_mrp - this.total_paid;
          this.gross = this.productData.reduce((p, x) => p + x.gross_value!, 0)
          this.tax = this.productData.reduce((p, x) => p + x.tax_value!, 0)
          this.amountInWords = this.numberToWords(this.orderDetails.total_amount);


          for (let p of this.productData) {
            if (p.gst === 5) {
              this.grossValue5 += p.gross_value!;
              this.taxValue5 += p.tax_value!;
            }
            if (p.gst === 12) {
              this.grossValue12 += p.gross_value!;
              this.taxValue12 += p.tax_value!;
            }
            if (p.gst === 18) {
              this.grossValue18 += p.gross_value!;
              this.taxValue18 += p.tax_value!;
            }
            if (p.gst === 28) {
              this.grossValue28 += p.gross_value!;
              this.taxValue28 += p.tax_value!;
            }
            this.totalGrossValue += p.gross_value!;
            this.totalTaxValue += p.tax_value!;
          }

        }
      })
      setTimeout(() => {
        let timestamp = this.orderDetails.date;
        let parsedDate = new Date(timestamp);
        let year = parsedDate.getUTCFullYear();
        let month = parsedDate.getUTCMonth() + 1; // Months are 0-based, so add 1
        let day = parsedDate.getUTCDate();
        let hours = parsedDate.getUTCHours();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        let minutes = parsedDate.getUTCMinutes();
        const formattedDate = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        this.loader = false;
        this.date = formattedDate;
      }, 1000)
    }


    this.user.getUserEWalletInfo('').subscribe({
      next: data => {
        this.userDetails = data;
        for (let a of this.userDetails) {
          this.name = a.username;
        }
      }
    })

    setTimeout(() => {
      this.user.getBankDetails(this.orderDetails.user_id).subscribe({
        next: data => {
          this.bankDetails = data;
        }
      })
    }, 1000)
    // this.order.generateOrder().subscribe((res)=>{
    //   this.orderDetails = res;
    //   this.productData = this.orderDetails?.productList!
    //   console.log(this.orderDetails);
    //   this.total = res.total_amount;

    // })
  }

  numberToWords(number: any) {
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const thousands = ['', 'Thousand', 'Million', 'Billion'];

    function convertChunk(chunk: number): string {
      if (chunk === 0) return '';
      if (chunk < 10) return units[chunk];
      if (chunk < 20) return teens[chunk - 11];
      if (chunk < 100) {
        const ten = Math.floor(chunk / 10);
        const unit = chunk % 10;
        return tens[ten] + (unit > 0 ? ' ' + units[unit] : '');
      }
      if (chunk < 1000) {
        const hundred = Math.floor(chunk / 100);
        const remainder = chunk % 100;
        return units[hundred] + ' Hundred' + (remainder > 0 ? ' and ' + convertChunk(remainder) : '');
      }
      return '';
    }

    if (number === 0) return 'Zero';

    let words = '';
    let chunkIndex = 0;

    while (number > 0) {
      const chunk = number % 1000;
      if (chunk > 0) {
        words = convertChunk(chunk) + ' ' + thousands[chunkIndex] + ' ' + words;
      }
      number = Math.floor(number / 1000);
      chunkIndex++;
    }
    return words.trim();
  }


  addWaterMark(doc: any) {
    var totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      var imageSize = { width: 100, height: 100 }; // Original image size
      var newSize = { width: imageSize.width * 1, height: imageSize.height * 0.8 }; // Reduced size by 20%
      // var xPosition = doc.internal.pageSize.width - newSize.width - 60; // 50px from the right
      var xPosition = (doc.internal.pageSize.width - newSize.width) / 2;
      var yPosition = (doc.internal.pageSize.height - newSize.height) / 2;

      doc.addImage(
        '../../../assets/img/opac_new4.png',
        'PNG',
        xPosition,
        yPosition,
        newSize.width,
        newSize.height
      );
    }
    return doc;
  }

  addLogo(doc: any) {
    var totalPages = doc.internal.getNumberOfPages();
    doc.setPage(1);
    var imageSize = { width: 100, height: 25 }; // Original image size
    var newSize = { width: imageSize.width * 0.7, height: imageSize.height * 0.4 }; // Reduced size by 20%
    var xPosition = doc.internal.pageSize.width - newSize.width - 130;
    doc.addImage(
      '../../../assets/img/newLogo.png',
      'PNG',
      xPosition,
      //  yPosition,
      15,
      newSize.width,
      newSize.height
    );
    doc.setPage(totalPages);

    return doc;
  }

  addSignature(doc: any) {
    var totalPages = doc.internal.getNumberOfPages();
    doc.setPage(1);
    var imageSize = { width: 90, height: 50 }; // Original image size
    var newSize = { width: imageSize.width * 0.7, height: imageSize.height * 0.7 }; // Reduced size by 20%
    var xPosition = doc.internal.pageSize.width - newSize.width - 20; // 50px from the right
    doc.addImage(
      '../../../assets/img/signature.png',
      'PNG',
      xPosition,
      180,
      newSize.width,
      newSize.height
    );
    doc.setPage(totalPages);

    return doc;
  }


  printInvoice() {
    let pdf = new jsPDF();
    const image = new Image();
    image.src = '../../../assets/img/signature.png';
    autoTable(pdf, {
      body: [
        [
          {
            content: 'Tax Invoice',
            styles: {
              halign: 'right',
              fontSize: 20,
              textColor: '#000000'
            }
          }
        ],
      ],
      theme: 'plain',
      styles: {
        fillColor: '#fff'
      }
    });
    autoTable(pdf, {
      body: [
        [
          {
            content: 'Order Number:' + this.orderDetails.order_id
              + '\n' + this.date,
            styles: {
              halign: 'right',
            }
          }
        ],
      ],
      theme: 'plain'
    });
    autoTable(pdf, {
      body: [
        [
          {
            content: 'Sold by:'
              + '\nPrime Health 5D (India) Pvt.Ltd.'
              + '\n#6-B, 2nd Floor, Kote NCMR Building,'
              + '\nNext to ring View apts, Doddanekkundi, '
              + '\n560037 - Bengaluru'
              + '\nIndia'
              + '\n'
              + '\nGST Registration Number: 29AAGCP6456J1ZU',
            styles: {
              halign: 'left',
            }
          },
          {
            content: 'Billing Address:'
              + '\n' + this.name
              + '\n' + this.orderDetails.address.door_num
              + '\n' + this.orderDetails.address.street
              + '\n' + this.orderDetails.address.city + ' - ' + this.orderDetails.address.pincode
              + '\nIndia'
              + '\n'
              + '\nPAN No: ' + this.bankDetails.pan
              + '\nGSTIN : ' + this.bankDetails.gst ?? 'NILL',
            styles: {
              halign: 'right',
            }
          }
        ],
      ],
      theme: 'plain'
    });
    autoTable(pdf, {
      body: [
        [
          {
            content: 'Purchased Products List',
            styles: {
              halign: 'left',
              fontSize: 14
            }
          }
        ]
      ],
      theme: 'plain'
    });
    var row: RowInput[] = [];
    for (var a = 0; a < this.productData.length; a++) {
      row.push([String(a + 1), this.productData[a].name!, String(this.productData[a].hsn), String(this.productData[a].quantity), String(this.productData[a].mrp),
      String(this.productData[a].total_mrp), String(this.productData[a].dic_value), String(this.productData[a].gst), String(this.productData[a].gross_value),
      String(this.productData[a].tax_value), String(this.productData[a].disc_price)])

    }
    console.log(row);
    autoTable(pdf, {
      head: [['Sl.No', 'Products', 'HSN Code', 'Quantity', 'Amount', 'Net Amount', 'Dis.Value', 'GST(%)', 'Gross Value', 'Tax', 'Total']],
      body: row,
      // body: [
      // ['1','Asro5dshdgagdasgdhagsdashdhadasgddasdhdjdsvjasdjhagdvahdsgacs', 'AHY1234', '2', '100', '170','5','172','2','170'],
      // ['2','Asro5dshdgagdasgdhagsdashdhadasgddasdhdjdsvjasdjhagdvahdsgacs', 'AHY1234', '2', '100', '170','5','172','2','170'],
      // ['3','Asro5dshdgagdasgdhagsdashdhadasgddasdhdjdsvjasdjhagdvahdsgacs', 'AHY1234', '2', '100', '170','5','172','2','170'],
      // ['4','Asro5dshdgagdasgdhagsdashdhadasgddasdhdjdsvjasdjhagdvahdsgacs', 'AHY1234', '2', '100', '170','5','172','2','170'],
      // ['5','Asro5dshdgagdasgdhagsdashdhadasgddasdhdjdsvjasdjhagdvahdsgacs', 'AHY1234', '2', '100', '170','5','172','2','170'],
      // ],
      theme: 'grid',
      headStyles: {
        fillColor: '#2980ba'
      },
      styles: {
        fontSize: 8
      }
    });

    let rows: RowInput[] = [];
    if (this.grossValue5 != 0) {
      rows.push([this.grossValue5, '5', '', this.taxValue5 / 2, this.taxValue5 / 2, this.grossValue5 + this.taxValue5])
    }
    if (this.grossValue12 != 0) {
      rows.push([this.grossValue12, '12', '', this.taxValue12 / 2, this.taxValue12 / 2, this.grossValue12 + this.taxValue12])
    }
    if (this.grossValue18 != 0) {
      rows.push([this.grossValue18, '18', '', this.taxValue18 / 2, this.taxValue18 / 2, this.grossValue18 + this.taxValue18])
    }
    if (this.grossValue28 != 0) {
      rows.push([this.grossValue28, '28', '', this.taxValue28 / 2, this.taxValue28 / 2, this.grossValue28 + this.taxValue28])
    }
    if (this.totalGrossValue != 0) {
      rows.push([this.totalGrossValue, '', '', this.totalTaxValue / 2, this.totalTaxValue / 2, this.totalGrossValue + this.totalTaxValue])
    }

    autoTable(pdf, {
      head: [['Gross', 'Tax Rate', 'IGST', 'CGST', 'SGST', 'TOTAL']],
      body: rows,
      // [this.grossValue5, '5' , '', this.taxValue5/2, this.taxValue5/2, this.grossValue5+this.taxValue5],
      // [this.grossValue12, '12' , '', this.taxValue12/2, this.taxValue12/2, this.grossValue12+this.taxValue12],
      // [this.grossValue18, '18' , '', this.taxValue18/2, this.taxValue18/2, this.grossValue18+this.taxValue18],
      // [this.grossValue28, '28' , '', this.taxValue28/2, this.taxValue28/2, this.grossValue28+this.taxValue28],
      // [this.totalGrossValue, '', '', this.totalTaxValue/2, this.totalTaxValue/2, this.totalGrossValue+this.totalTaxValue]

      theme: 'striped',
      headStyles: {
        fillColor: '#efcb6a',
        fontSize: 8
      },
      styles: {
        cellPadding: { top: 1, right: 1, bottom: 1, left: 1 },  // Adjust cell padding
        fontSize: 6,
        halign: 'right'
      },
      columnStyles: {
        0: { cellWidth: 15 },  // Adjust the width of the 1st column (Gross)
        1: { cellWidth: 15 },  // Adjust the width of the 2nd column (Tax Rate)
        2: { cellWidth: 15 },  // Adjust the width of the 3rd column (IGST)
        3: { cellWidth: 15 },  // Adjust the width of the 4th column (CGST)
        4: { cellWidth: 15 },  // Adjust the width of the 5th column (SGST)
        5: { cellWidth: 15 }   // Adjust the width of the 6th column (TOTAL)
      },
      margin: {
        left: 105
      }

    });

    autoTable(pdf, {
      body: [
        [
          {
            content: 'Gross Total(INR)',
            styles: {
              cellPadding: { top: 1, right: 1, bottom: 1, left: 1 },
              halign: 'center'
            }
          },
          {
            content: this.gross,
            styles: {
              cellPadding: { top: 1, right: 1, bottom: 1, left: 1 },
              halign: 'right',
              fontStyle: 'bold'
            }
          }
        ],
        [
          {
            content: 'Total Tax',
            styles: {
              cellPadding: { top: 1, right: 1, bottom: 1, left: 1 },
              halign: 'center'
            }
          },
          {
            content: this.tax,
            styles: {
              cellPadding: { top: 1, right: 1, bottom: 1, left: 1 },
              halign: 'right',
              fontStyle: 'bold'
            }
          }
        ],
        [
          {
            content: 'Total Amount(INR)',
            styles: {
              cellPadding: { top: 1, right: 1, bottom: 1, left: 1 },
              halign: 'center'
            }
          },
          {
            content: this.orderDetails.total_amount,
            styles: {
              cellPadding: { top: 1, right: 1, bottom: 1, left: 1 },
              halign: 'right',
              fontStyle: 'bold'
            }
          }
        ],

      ],
      tableWidth: 'auto',
      margin: {
        left: 100
      },
      theme: 'grid'
    });

    autoTable(pdf, {
      body: [
        [
          {
            content: 'Total Amount In Words:',
            styles: {
              halign: 'right'
            }
          },
          {
            content: this.amountInWords + ' rupees only',
            styles: {
              halign: 'center',
              fontStyle: 'bold'
            }
          }
        ]
      ],
      theme: 'plain',
      styles: {
        fillColor: '#a6d517'
      }
    });

    autoTable(pdf, {
      body: [
        [
          {
            content: ''
          }
        ]
      ],
      didDrawCell: data => {

        const imgWidth = 50; // Adjust the image width
        const imgHeight = 15; // Adjust the image height
        const cellHeight = data.cell.height; // Get the cell height
        const paddingX = 50; // Adjust the horizontal padding
        const x = data.cell.x + data.cell.padding('horizontal') + paddingX + (data.cell.width - imgWidth) / 2; // Adjusted X position
        const y = data.cell.y + (cellHeight - imgHeight) / 2; // Center the image vertically
        pdf.addImage('../../../assets/img/signature.png', x, y, imgWidth, imgHeight);

      },
      theme: 'plain',
    })

    autoTable(pdf, {
      body: [
        [
          {
            content: 'For Prime 5D:',
            styles: {
              halign: 'right',
              fontSize: 14,
              fontStyle: 'bold',
            }
          },
          {
            content: 'Authorized Signature',
            styles: {
              halign: 'right',
              fontStyle: 'bold',
              fontSize: 12
            }
          },
        ]
      ],
      tableWidth: 'wrap',
      margin: {
        left: 110
      }
    });

    pdf = this.addWaterMark(pdf);
    pdf = this.addLogo(pdf);
    // pdf = this.addSignature(pdf);
    return pdf.save(this.orderDetails.order_id + "  Invoice");

  }


}
