export function getNow(req?: Request): Date {
  if (
    process.env.TEST_MODE === "1" &&
    req?.headers.get("x-test-now-ms")
  ) {
    return new Date(Number(req.headers.get("x-test-now-ms")));
  }

  return new Date();
}
