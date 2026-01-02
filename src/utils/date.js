export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('fr-FR');
  } catch {
    return dateString;
  }
};

export const calculateAge = (birthDate, deathDate = null) => {
  if (!birthDate) return null;
  
  try {
    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) return null;
    
    const endDate = deathDate ? new Date(deathDate) : new Date();
    if (isNaN(endDate.getTime())) return null;
    
    let age = endDate.getFullYear() - birth.getFullYear();
    const monthDiff = endDate.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && endDate.getDate() < birth.getDate())) {
      age--;
    }
    
    return age >= 0 ? age : null;
  } catch {
    return null;
  }
};
