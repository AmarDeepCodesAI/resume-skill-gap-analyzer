type Props = {
  skill: string;
  type: "matched" | "missing";
};

export default function SkillBadge({ skill, type }: Props) {
  const styles =
    type === "matched"
      ? "bg-green-500/20 text-green-300"
      : "bg-red-500/20 text-red-300";

  return (
    <span className={`${styles} px-3 py-1 rounded-full text-sm`}>
      {skill}
    </span>
  );
}