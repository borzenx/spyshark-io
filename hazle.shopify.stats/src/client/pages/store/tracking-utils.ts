// trackingUtils.ts

export function isNameInTrackedList(name: string | null): boolean {
    if (name !== null) {
      const trackedList = localStorage.getItem('trackedStores');
  
      if (trackedList) {
        // Parse the JSON string into an array of objects
        const objects: Array<{ storeLink: string }> = JSON.parse(trackedList);
  
        // Extract an array of storeLink values from the objects
        const storeLinks: string[] = objects.map((obj: { storeLink: string }) => obj.storeLink);
  
        // Check if 'name' is in the array of storeLinks
        return storeLinks.includes(name);
      }
    }
  
    return false; // Return false if the name is not in the tracking list or if it's null
  }
  