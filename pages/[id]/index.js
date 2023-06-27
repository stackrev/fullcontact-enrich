import fetch from "isomorphic-unfetch";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Confirm, Button, Loader, Card, Image } from "semantic-ui-react";
import absoluteUrl from "next-absolute-url";
import { route } from "next/dist/next-server/server/router";
import Link from "next/link";
import JSONTree from "../../components/JSONTree";

const Visitor = ({ visitor }) => {
  return (
    <div className="min-h-screen antialiased bg-gray-200 flex py-8 flex-col items-center justify-center">
      <div className="bg-gray-200 h-screen w-screen-md">
        <div className="flex justify-between items-center ">
          <h1 className="text-3xl font-medium ">View Client</h1>
          <Link href="/">
            <a className=" text-md text-gray-700 font-medium hover:text-gray-900 ">
              Back
            </a>
          </Link>
        </div>
        <div className=" overflow-x-auto shadow rounded-lg visitor my-6 border lg:p-4 bg-white ">
          <h4>{visitor.email}</h4>
          <p>id: {visitor._id}</p>
          <p>PID: {visitor.pid}</p>
          {/* <div>{JSONTree(visitor.info)}</div> */}
        </div>
        {/* <Card>
          <Image
            src="https://react.semantic-ui.com/images/wireframe/white-image.png"
            wrapped
            ui={false}
          />
          <Card.Content>
            <Card.Header>{visitor.email}</Card.Header>

            <Card.Description>
              <p> Information: {visitor.info}</p>
            </Card.Description>
          </Card.Content>
        </Card> */}
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const id = context.query.id;
  const res = await fetch(`http://localhost:3000/api/visitor/${id}`);
  const { data } = await res.json();

  return { props: { visitor: data } };
}

// Visitor.getInitialProps = async ({ req, query: { id } }) => {
//   const { origin } = absoluteUrl(req, "localhost:3000");

//   const resp = await fetch(`${origin}/api/visitor/${id}`);
//   const { data } = await resp.json();

//   return { visitor: data };
// };

export default Visitor;
