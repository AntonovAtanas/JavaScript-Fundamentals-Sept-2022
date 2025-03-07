import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [
    new Recipe('A First Test Recipe', 'This is simply a test', 'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg'),
    new Recipe('A Second Test Recipe', 'This is simply a test', 'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg')
  ];

  @Output() currentRecipe = new EventEmitter<Recipe>()

  constructor() { }

  ngOnInit() {
  }

  selectedRecipe(recipe: Recipe){
    this.currentRecipe.emit(recipe);
  }

}
