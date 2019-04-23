import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { UserService } from '../../services/user.service';
import {User} from '../../models/user';
import {NavbarService} from '../../services/navbar.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  public user: User;

  constructor(
    public nav: NavbarService,
    public router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}
  ngOnInit() {}

}
