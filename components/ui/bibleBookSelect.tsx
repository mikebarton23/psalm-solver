import React, { ReactNode } from "react";

import Select, { GroupBase } from "react-select";

import { newTestamentBooks, oldTestamentBooks } from "@/data/BibleBooks";

type OptionType = { label: string; value: string };
type GroupType = GroupBase<OptionType>;

// Prepare your Bible books data for react-select
const groupedOptions = [
  {
    label: "New Testament",
    options: newTestamentBooks.map((book) => ({ label: book, value: book })),
  },
  // {
  //   label: "Old Testament",
  //   options: oldTestamentBooks.map((book) => ({ label: book, value: book })),
  // },
];

const groupStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
};

const groupBadgeStyles: React.CSSProperties = {
  backgroundColor: "#374151",
  borderRadius: "2em",
  color: "#fff",
  display: "inline-block",
  fontSize: 16,
  fontWeight: "normal",
  lineHeight: "1",
  minWidth: 1,
  padding: "0.16666666666667em 0.5em",
  textAlign: "center",
};
export default function BibleBooksSelect({ onChange }: { onChange: (value: string) => void }) {
  const customStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: "#2D3748", // Tailwind bg-gray-700
      borderColor: "#4A5568", // Tailwind border-gray-600 for a slight contrast
      color: "#fff", // Ensure text color is white
      width: "100%", // Ensure the select takes up the full width of its container
      height: "100%", // Ensure the select takes up the full height of its container
      boxShadow: "none", // Remove default shadow
      "&:hover": {
        borderColor: "#718096", // Tailwind border-gray-500 on hover
      },
      minHeight: "100%", // Ensure control expands to the full height
      fontSize: "16px",
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: "#2D3748", // Tailwind bg-gray-700 for the dropdown
      color: "#fff", // Ensure menu text is white
      // Apply font size here as well if menu items are too small
      fontSize: "16px",
    }),
    option: (base: any, state: { isFocused: any }) => ({
      ...base,
      backgroundColor: state.isFocused ? "#4A5568" : "#2D3748", // Tailwind bg-gray-600 for focused and bg-gray-700 for default
      color: "#fff", // Ensure option text is white
      "&:active": {
        backgroundColor: "#2C5282", // Tailwind bg-blue-700 for active
      },
      // Apply font size here to ensure consistency
      fontSize: "16px",
    }),
    singleValue: (base: any) => ({
      ...base,
      color: "#fff", // Ensure selected value text is white
      // Adjusting here ensures selected value matches the desired size
      fontSize: "1.25rem", // Adjusted from "1.25rem" to ensure minimum 16px
    }),
    input: (base: any) => ({
      ...base,
      color: "#fff", // Ensure input text is white
      fontSize: "16px", // Adjust the font size as needed
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "#A0AEC0", // Lighter color for placeholder, similar to Tailwind text-gray-400
      fontSize: "16px", // Adjust the font size as needed
    }),
    valueContainer: (provided: any, state: any) => ({
      ...provided,
      height: "41px",
      padding: "0 6px",
      fontSize: "1.25rem",
      // Ensuring the container respects the font size change
    }),
    groupHeading: (base: any) => ({
      ...base,
      color: "#A0AEC0", // Tailwind text-gray-400 for the group labels
      fontSize: "16px", // Adjust the font size as needed
    }),
  };

  const formatGroupLabel = (group: GroupType) => (
    <div style={groupStyles}>
      {group.label}
      <span style={groupBadgeStyles}>{group.options.length}</span>
    </div>
  );

  return (
    <Select
      options={groupedOptions}
      formatGroupLabel={formatGroupLabel}
      styles={customStyles}
      isClearable={true}
      onChange={(selectedOption: OptionType | null) => {
        // If selectedOption is not null, use its value; otherwise, use an empty string
        const value = selectedOption ? selectedOption.value : "";
        onChange(value);
      }}
    />
  );
}
