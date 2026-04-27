import "./Profile.css";
import SectionHeader from "../components/SectionHeader";

type TProfileField = {
  label: string;
  value: string;
};

const fields: TProfileField[] = [
  { label: "Name", value: "Donovan Byler" },
  { label: "Email", value: "donovan.byler@example.com" },
  { label: "Title", value: "Product Engineer" },
  { label: "Team", value: "Todo Platform" },
  { label: "Location", value: "Remote, US" },
  { label: "Phone", value: "+1 (555) 014-9981" },
];

export default function Profile() {
  return (
    <section className="profile-page" aria-labelledby="profile-heading">
      <SectionHeader
        titleId="profile-heading"
        kicker="Account"
        title="Profile"
      />

      <div className="profile-card panel-surface">
        {fields.map((field) => (
          <div className="profile-field" key={field.label}>
            <p className="field-label">{field.label}</p>
            <p className="field-value">{field.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
