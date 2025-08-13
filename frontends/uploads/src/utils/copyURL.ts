export const copyUrl = (url: string | undefined) => {
  if (url) {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert('URL copied to clipboard!');
      })
      .catch((error) => {
        console.error('Failed to copy URL: ', error);
        alert('Failed to copy URL.');
      });
  } else {
    alert('No URL available to copy.');
  }
};
