import { JSONAPISerializer } from 'ember-cli-mirage';
import Collection from 'ember-cli-mirage/orm/collection';

function isCollection(object) {
  return object instanceof Collection;
}

export default JSONAPISerializer.extend({

  include: ['tags'],

  serialize(posts, request) {
    let newPosts = posts.models.map(post => {
      let postTags = post.postTags.models || [];
      let tags = postTags.map(pt => pt.tag);

      post.tags = new Collection('tag', tags);

      return post;
    });
    let newPostCollection = new Collection('post', newPosts);

    return JSONAPISerializer.prototype.serialize.call(this, newPostCollection, request);
  },

  _resourceObjectFor(model /*, request */) {
    let attrs = this._attrsForModel(model);

    let obj = {
      type: this.typeKeyForModel(model),
      id: model.id,
      attributes: attrs
    };

    let linkData = this._linkDataFor(model);

    this.include.forEach(camelizedType => {
      let relationship = model[camelizedType];
      let relationshipKey = this.keyForRelationship(camelizedType);

      if (isCollection(relationship)) {
        if (!obj.relationships) {
          obj.relationships = {};
        }

        obj.relationships[relationshipKey] = {
          data: relationship.models.map(model => {
            return {
              type: this.typeKeyForModel(model),
              id: model.id
            };
          })
        };
      } else if (relationship) {
        if (!obj.relationships) {
          obj.relationships = {};
        }

        obj.relationships[relationshipKey] = {
          data: {
            type: this.typeKeyForModel(relationship),
            id: relationship.id
          }
        };
      }

      if (linkData && linkData[camelizedType]) {
        this._addLinkData(obj, relationshipKey, linkData[camelizedType]);
      }
    });

    return obj;
  }

});
