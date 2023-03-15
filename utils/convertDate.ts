export const convertDate = (data: string) => {
  const date = new Date(data);
  const formattedDate = date.toISOString().split('T')[0];
  const formattedTime = date.toISOString().split('T')[1].split('.')[0];

  const formattedDateTime = `${formattedDate} ${formattedTime}`;
  return formattedDateTime;
};