import { useState } from "react";
export default function JSONTree({ data, isChild = false }) {
  const [collapsed, setCollapsed] = useState(false);
  console.log("data: ", data);
  const handleClick = () => setCollapsed(!collapsed);
  const renderTree = (nodes) => (
    <ul>
      {Object.keys(nodes).map((key) => {
        if (typeof nodes[key] === "object" && nodes[key] !== null) {
          return (
            <li key={key}>
              <span onClick={handleClick}>
                {collapsed ? "▶" : "▼"} {key}
              </span>
              {!collapsed && <JSONTree data={nodes[key]} isChild={true} />}
            </li>
          );
        }
        return (
          <li key={key}>
            {key}: {nodes[key].toString()}
          </li>
        );
      })}
    </ul>
  );
  return <div style={{ marginLeft: isChild ? 20 : 0 }}>{renderTree(data)}</div>;
}
