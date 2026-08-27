const processPayment = (log) => {
  log.info('payment.process');
  // Simulate some payment processing
  setTimeout(() => {
    log.info('payment.complete');
  }, 500);
};

module.exports = { processPayment };
