export const nowWib = () => {
  const now = new Date();
  const hari = new Date(now.getTime() + (7 * 60 * 60 * 1000));
  
  return hari;
};

export function formatDateTime(value: string) {
  const [datePart, timePart] = value.split("T");

  const time = timePart.slice(0, 5); 

  return `${datePart} ${time}`;
}