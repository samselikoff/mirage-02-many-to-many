import Model from 'ember-data/model';
import { hasMany } from 'ember-data/relationships';
import attr from 'ember-data/attr';

export default Model.extend({

  name: attr(),
  posts: hasMany()

});
