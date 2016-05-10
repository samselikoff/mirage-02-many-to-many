export default function(server) {

  let economics = server.create('tag', { name: 'Economics' });
  let programming = server.create('tag', { name: 'Programming' });
  let politics = server.create('tag', { name: 'Politics' });

  let post1 = server.create('post');
  server.create('post-tag', { postId: post1.id, tagId: economics.id });

  let post2 = server.create('post');
  server.create('post-tag', { postId: post2.id, tagId: economics.id });
  server.create('post-tag', { postId: post2.id, tagId: politics.id });

  server.create('post');

}
