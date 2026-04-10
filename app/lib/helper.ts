export const nowWib = () => {
  const now = new Date();
  const jakartaTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
  
  return jakartaTime;
};