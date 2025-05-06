// src/app/core/todo.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Todo {
  id: number;
  name: string;
  content: string;
  completed: boolean;
}

@Injectable()
export class TodoService {
  private todos$ = new BehaviorSubject<Todo[]>([]);
  private idSeq = 1;

  getTodos(): Observable<Todo[]> {
    return this.todos$.asObservable();
  }

  getById(id: number): Todo | undefined {
    return this.todos$.value.find((t) => t.id === id);
  }

  add(name: string, content: string): void {
    const newTodo: Todo = { id: this.idSeq++, name, content, completed: false };
    this.todos$.next([...this.todos$.value, newTodo]);
  }

  update(updated: Todo): void {
    const list = this.todos$.value.map((t) =>
      t.id === updated.id ? updated : t
    );
    this.todos$.next(list);
  }

  delete(id: number): void {
    const list = this.todos$.value.filter((t) => t.id !== id);
    this.todos$.next(list);
  }
}
