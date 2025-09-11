import zxcvbn from 'zxcvbn';

export function ensureStrongPassword(pw) {
  const score = zxcvbn(pw).score; // 0..4
  // require >= 3 (~"safely unguessable")
  return score >= 3;
}
