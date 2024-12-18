import React from 'react';
import { motion } from 'framer-motion';

const ExampleComponent: React.FC = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1>Hello World</h1>
    </motion.div>
  );
};

export default ExampleComponent; 