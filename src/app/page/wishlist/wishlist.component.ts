import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../wishlist.service';
import { Product } from '../../type/Products';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  userId: string | null = null;
  wishlist: Product[] = [];
  successMessage: string | null = null; 

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    console.log('User ID:', this.userId); 
    this.loadWishlist();
  }

  loadWishlist(): void {
    if (this.userId) {
      this.wishlistService.getWishlist(this.userId).subscribe({
        next: (data: any) => {
          console.log('Raw Data:', data);  
          
          if (data && Array.isArray(data)) {
            this.wishlist = data; 
            console.log('Mapped Wishlist:', this.wishlist);
          } else {
            console.error('Dữ liệu không hợp lệ:', data);
          }
        },
        error: (err) => {
          console.error('Lỗi khi tải danh sách wishlist:', err);
        }
      });
    }
  }
  
  removeFromWishlist(productId: string): void {
    if (this.userId) {
      this.wishlistService.removeFromWishlist(this.userId, productId).subscribe({
        next: () => {
          this.wishlist = this.wishlist.filter(product => product.id !== productId);
          this.successMessage = 'Product removed from wishlist successfully!'; 
          setTimeout(() => {
            this.successMessage = null; 
          }, 3000);
        },
        error: (err) => {
          console.error('Lỗi khi xóa sản phẩm khỏi wishlist:', err);
        }
      });
    }
  }
  
}
