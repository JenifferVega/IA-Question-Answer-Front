export function splitParagraphInTwo(paragraph, searchText) {
    const position = paragraph.indexOf(searchText);
    
    if (position !== -1) {
      // The first part includes the searchText
      const firstPart = paragraph.slice(0, position + searchText.length).trim();
      
      // The second part is everything after the searchText
      const secondPart = paragraph.slice(position + searchText.length).trim();
      
      return [firstPart, secondPart];
    } else {
      return [null, paragraph];
    }
}
  