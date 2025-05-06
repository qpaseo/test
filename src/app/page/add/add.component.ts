import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TodoService } from '../../core/todo.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  standalone: false,
})
export class AddComponent {
  name = '';
  content = '';

  constructor(private service: TodoService, private router: Router) {}

  create() {
    if (this.name.trim()) {
      this.service.add(this.name, this.content);
      this.router.navigate(['/']);
    }
  }
}
