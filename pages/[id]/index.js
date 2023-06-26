import fetch from "isomorphic-unfetch";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Confirm, Button, Loader, Card, Image } from "semantic-ui-react";
import absoluteUrl from "next-absolute-url";
import { route } from "next/dist/next-server/server/router";
import Link from "next/link";

const Visitor = ({ visitor }) => {
  return (
    <div className="min-h-screen antialiased bg-gray-200 flex py-8 flex-col items-center justify-center">
      <div className="bg-gray-200 h-screen">
        <div className="flex justify-between items-center ">
          <h1 className="text-3xl font-medium ">View Visitor</h1>
          <Link href="/">
            <a className=" text-md text-gray-700 font-medium hover:text-gray-900 ">
              Back
            </a>
          </Link>
        </div>

        <Card>
          <Image
            src="https://react.semantic-ui.com/images/wireframe/white-image.png"
            wrapped
            ui={false}
          />
          <Card.Content>
            <Card.Header>{visitor.pid}</Card.Header>

            <Card.Description>
              <p>{visitor.email}</p>
              <p> Information: {visitor.harga}</p>
            </Card.Description>
          </Card.Content>
          <Card.Content extra>Arkademy Store</Card.Content>
        </Card>
      </div>
    </div>
  );
};

Visitor.getInitialProps = async ({ req, query: { id } }) => {
  const { origin } = absoluteUrl(req, "localhost:3000");

  const resp = await fetch(`${origin}/api/visitor/${id}`);
  const { data } = await resp.json();

  return { visitor: data };
};

export default Visitor;
