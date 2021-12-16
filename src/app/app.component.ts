import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store'
import { AppState } from './store';
import { filter, fromEvent, map, Observable } from 'rxjs';
import { addTodo, deleteTodo } from './store/actions/todo.actions';
import { animate, style, transition, trigger } from '@angular/animations';
import { Todo } from './store/reducers/todo.reducer';
import { selectTodos } from './store/selectors/todo.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [],
  // 定义动画
  animations: [
    trigger('slide', [
      // 入场动画
      transition('void => *', [
        style({opacity: 0, transform: 'translateY(40px)'}),
        animate(250, style({opacity: 1, transform: 'translateY(0)'}),)
      ]),
    ])
  ]
})
export class AppComponent implements AfterViewInit {
  @ViewChild('AddTodoInput') AddTodoInput!: ElementRef
  todos: Observable<Todo[]>
  constructor (private store: Store<AppState>) {
    this.todos = this.store.pipe(select(selectTodos))
  }

  ngAfterViewInit(): void {
    fromEvent<KeyboardEvent>(this.AddTodoInput.nativeElement, 'keyup')
      .pipe(
        filter((event) => event.key === 'Enter'),
        map((event) => (<HTMLInputElement>event.target).value),
        map((title) => title.trim()),
        filter(title => title !== '')
      )
      .subscribe(title => {
        this.store.dispatch(addTodo({ title }))
        this.AddTodoInput.nativeElement.value = ''
      })
  }

  deleteTodo (id: string) {
    this.store.dispatch(deleteTodo({ id }))
  }
}
