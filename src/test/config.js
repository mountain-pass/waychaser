export var PORT = Number.parseInt(
  process.env.PORT ||
    /* istanbul ignore next: because it's only unset when the test are configured correctly */ '6060'
);
