import { Component, OnInit, OnDestroy } from '@angular/core';
import { Http } from '@angular/http';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/do';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'suggested git users';
  userCache;

  cachedUsers$: Observable<any>;
  usersToFollow$: Observable<string>;

  closedUsers = new Subject<string>();
  apiUrlSubject = new BehaviorSubject('https://api.github.com/users');

  constructor(private http: Http) {}

  ngOnInit(): void {
    this.cachedUsers$ = this.closedUsers.asObservable()
    .scan((all: string[], user: string) => {
      all.push(user);
      return all;
    }, [])
    .map(closedUsers => {
      return this.LoadInNewCachedUser(closedUsers)
    });

    this.usersToFollow$ = this.apiUrlSubject.asObservable()
    .mergeMap(url => {
      return this.http.get(url)
      .map(res => res.json());
    })
    .do(res => this.userCache = res)
    .merge(this.cachedUsers$)
    .map(users => users.slice(0, 3));
  }

  refresh() {
    var random = Math.floor(Math.random() * 500);
    this.apiUrlSubject.next(`https://api.github.com/users?since=${random}`);
  }

  close(userUrl: string) {
    this.closedUsers.next(userUrl);
  }

  private LoadInNewCachedUser(closedUsers: string[]) {
    const unclosedCachedUsers = this.userCache.slice()
                                .filter(user => closedUsers.some(closed => closed === user.url) === false)
                                .filter(user => this.userCache.slice(0, 3).some(top3 => top3.url === user.url) === false);

    this.userCache = this.userCache.map(user => {
      if (closedUsers.some(closedUser => closedUser === user.url)) {
        return unclosedCachedUsers.pop();
        } else {
        return user;
      }
    });

    return this.userCache;
  }
}
