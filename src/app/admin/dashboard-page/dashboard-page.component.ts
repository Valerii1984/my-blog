import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../shared/components/admin-loyout/services/auth.service';
import { PostService } from 'src/app/shared/post.service';
import { Post } from 'src/app/shared/interfaces';
import { Subscription } from 'rxjs';
import { AlertService } from '../shared/components/admin-loyout/services/alert.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy{
posts?: Post[] = []
pSub?: Subscription
dSub?: Subscription
searchStr = ''


constructor(
  private postsService: PostService,
  private alert: AlertService
  ) {

}
ngOnInit(): void {
  this.pSub = this.postsService.getAll().subscribe(posts => {
    this.posts = posts
  })
}

remove(id: string) {
  this.dSub = this.postsService.remove(id).subscribe(() => {
    this.posts = this.posts?.filter( post => post.id !== id)
    this.alert.warning("Пост удален, МУДИЛА!")
  })
}

ngOnDestroy(){
  if(this.pSub) {
    this.pSub.unsubscribe()
  }
  if(this.dSub) {
    this.dSub.unsubscribe()
}
}
}
