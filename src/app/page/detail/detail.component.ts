import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoService, Todo } from '../../core/todo.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  standalone: false,
})
export class DetailComponent implements OnInit {
  todo!: Todo;
  name!: string;
  content!: string;
  completed!: boolean;

  constructor(
    private route: ActivatedRoute,
    private service: TodoService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    const t = this.service.getById(id);
    if (t) {
      this.todo = t;
      this.name = t.name;
      this.content = t.content;
      this.completed = t.completed;
    } else {
      this.router.navigate(['/']);
    }
  }

  save() {
    this.service.update({
      ...this.todo,
      name: this.name,
      content: this.content,
      completed: this.completed,
    });
    this.router.navigate(['/']);
  }
}
