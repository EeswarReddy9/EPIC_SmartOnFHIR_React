export const updateQualityMeasure = async (memberId, measureId, newStatus) => {
    try {
      const response = await fetch('/api/update-quality-measure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          measureId,
          newStatus,
          memberId
        }),
      });
      
      if (!response.ok) throw new Error('Update failed');
      return await response.json();
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  };