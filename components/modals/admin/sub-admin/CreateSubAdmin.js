import DefaultBtn from "@/components/ui/buttons/DefaultBtn";
import Heading from "@/components/ui/heading/Heading";
import {
  CardBody,
  CardFooter,
  Checkbox,
  Dialog,
  IconButton,
  Input,
  Typography,
} from "@material-tailwind/react";
import React, { useState } from "react";
import { RiAdminFill } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";
import { toast } from "sonner";

const CreateSubAdmin = ({ open, setOpen, setAdmins }) => {
  const handleOpen = () => setOpen(!open);
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    phoneNumber: "",
    password: "",
  });

  const [noteChecked, setNoteChecked] = useState(false);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFormData({
        ...formData,
        image: event.target.files[0],
      });
    }
  };
  const handleNumInputChange = (e) => {
    const { name, value } = e.target;
    const isValid = /^\d*$/.test(value);
    if (isValid) {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      toast.error("Please enter digits only");
    }
  };

  const createAdminAccount = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("Name is required");
      return;
    }

    if (!formData.phoneNumber) {
      toast.error("Phone number is required");
      return;
    }

    if (!formData.password) {
      toast.error("Password is required");
      return;
    }

    if (!formData.image) {
      toast.error("Image is required");
      return;
    }

    if (!noteChecked) {
      toast.warning("Click on I agree before creating new admin account!");
      return;
    }

    const promise = new Promise(async (resolve, reject) => {
      try {
        const data = new FormData();

        data.append("name", formData.name);
        data.append("phoneNumber", formData.phoneNumber);
        data.append("password", formData.password);

        if (formData.image) {
          data.append("image", formData.image);
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/sub-admin`,
          {
            method: "POST",
            body: data,
          }
        );

        const newAdmin = await response.json();

        if (response.ok) {
          setAdmins((prevAdmins) => [...prevAdmins, newAdmin]);
          setOpen(false);

          setFormData({ image: null, phoneNumber: "", password: "", name: "" });

          resolve(newAdmin);
        } else {
          reject(newAdmin);
        }
      } catch (err) {
        reject(err);
      }
    });

    toast.promise(promise, {
      loading: "Creating admin...",
      success: (data) => `${data.name} admin created successfully!`,
      error: (err) => `${err}`,
    });

    promise.catch((err) => {
      console.log(err);
      toast.error("Something went wrong");
    });
  };
  return (
    <Dialog
      size="sm"
      open={open}
      handler={handleOpen}
      className="bg-transparent shadow-none"
    >
      <form
        className="mx-auto w-full bg-white rounded-lg"
        onSubmit={createAdminAccount}
      >
        <CardBody className="flex flex-col gap-4">
          <Heading
            icon={
              <div className="bg-gradient-to-r from-red-400 to-pink-400 p-1 rounded-full inline-block text-white">
                <RiAdminFill size={20} />
              </div>
            }
            title={"Create Admin Account"}
            buttons={[
              <IconButton key={1} variant="text" onClick={handleOpen}>
                <RxCross1 size={20} />
              </IconButton>,
            ]}
          />
          <Typography className="-mb-2" variant="h6">
            Name
          </Typography>
          <Input
            label="Ridhi suman"
            color="pink"
            size="lg"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Typography className="-mb-2" variant="h6">
            Phone Number
          </Typography>
          <Input
            label="123456789"
            name="phoneNumber"
            color="pink"
            minLength={10}
            maxLength={10}
            size="lg"
            value={formData.phoneNumber}
            onChange={handleNumInputChange}
          />
          <Typography className="-mb-2" variant="h6">
            Password
          </Typography>
          <Input
            label="******"
            color="pink"
            size="lg"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <Typography className="-mb-2" variant="h6">
            Profile Pic
          </Typography>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <Checkbox
            onChange={(e) => setNoteChecked(e.target.checked)}
            label={
              <div>
                <Typography color="blue-gray" className="font-medium">
                  I agree
                </Typography>
                <Typography
                  variant="small"
                  color="gray"
                  className="font-normal"
                >
                  With this created account anybody can have the power of Admin.
                </Typography>
              </div>
            }
            containerProps={{
              className: "-mt-5",
            }}
          />
        </CardBody>
        <CardFooter className="pt-0">
          <DefaultBtn
            title={"Create Account"}
            clickHandler={() => setOpen(true)}
            type="submit"
          />
        </CardFooter>
      </form>
    </Dialog>
  );
};

export default CreateSubAdmin;
