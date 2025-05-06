import { Component, OnInit } from '@angular/core';
import { TodoService, Todo } from '../../core/todo.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  todos$!: Observable<Todo[]>;

  constructor(private service: TodoService, private router: Router) {}

  ngOnInit() {
    this.todos$ = this.service.getTodos();
  }

  toggle(t: Todo) {
    this.service.update({ ...t, completed: !t.completed });
  }

  remove(id: number) {
    this.service.delete(id);
  }

  goDetail(id: number) {
    this.router.navigate(['/todo', id]);
  }

  goAdd() {
    this.router.navigate(['/add']);
  }
}
