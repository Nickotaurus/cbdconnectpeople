
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};

export const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3 }
};

export const staggerChildren = (delay: number = 0.1) => ({
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      staggerChildren: delay
    }
  }
});

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3
    }
  }
};

export const slideIn = (direction: 'left' | 'right' | 'up' | 'down' = 'right') => {
  const directionMap = {
    left: { x: -100, y: 0 },
    right: { x: 100, y: 0 },
    up: { x: 0, y: -100 },
    down: { x: 0, y: 100 }
  };
  
  return {
    initial: { 
      opacity: 0, 
      x: directionMap[direction].x, 
      y: directionMap[direction].y 
    },
    animate: { 
      opacity: 1, 
      x: 0, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    },
    exit: { 
      opacity: 0, 
      x: directionMap[direction].x, 
      y: directionMap[direction].y,
      transition: {
        duration: 0.3
      }
    }
  };
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: {
      duration: 0.3
    }
  }
};

export const revealFromBottom = {
  initial: { height: 0, opacity: 0 },
  animate: { 
    height: 'auto', 
    opacity: 1,
    transition: {
      height: {
        duration: 0.4,
      },
      opacity: {
        duration: 0.3,
        delay: 0.1
      }
    }
  },
  exit: { 
    height: 0, 
    opacity: 0,
    transition: {
      opacity: {
        duration: 0.2
      },
      height: {
        duration: 0.3,
        delay: 0.1
      }
    }
  }
};

// For lazy-loaded images
export const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.classList.remove('img-loading');
  e.currentTarget.classList.add('img-loaded');
};
