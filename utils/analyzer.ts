import { skills } from "../data/skills";
import { Result } from "../types/result";

export const analyzeResumeSkills = (
  resume: string,
  jd: string
): Result => {
  const resumeText = resume.toLowerCase();
  const jdText = jd.toLowerCase();

  const jdSkills = skills.filter((skill) =>
    jdText.includes(skill)
  );

  const matchedSkills = jdSkills.filter((skill) =>
    resumeText.includes(skill)
  );

  const missingSkills = jdSkills.filter(
    (skill) => !resumeText.includes(skill)
  );

  const percentage =
    jdSkills.length === 0
      ? 0
      : Math.round(
          (matchedSkills.length / jdSkills.length) * 100
        );

  return {
    percentage,
    matchedSkills,
    missingSkills,
  };
};