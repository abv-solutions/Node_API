// Button click function for DELETE request
deleteArticle = id => {
  fetch(`/articles/${id}`, {
    method: 'DELETE',
    headers: { allowed: 'true' }
  })
    .then(() => (window.location.href = '/'))
    .catch(err => console.log(err));
};
