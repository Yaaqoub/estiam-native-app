export function getImageUrl(imageUrl: string): string {
  const placeHolderUrl = 'https://projetcartylion.fr/wp-content/uploads/2020/08/Placeholder-600x600.png';

  try {
    new URL(imageUrl);

    return imageUrl;
  } catch (error) {
    return placeHolderUrl;
  }
}