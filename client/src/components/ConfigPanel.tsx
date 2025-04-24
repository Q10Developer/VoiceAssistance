import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FrappeCredentials, ConnectionStatus } from "@/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ConfigPanelProps {
  initialValues: FrappeCredentials;
  onSave: (data: FrappeCredentials) => void;
  isPending: boolean;
  connectionStatus: ConnectionStatus;
}

// Form validation schema
const configSchema = z.object({
  apiUrl: z.string().url({ message: "Please enter a valid URL" }),
  apiKey: z.string().min(1, { message: "API Key is required" }),
  apiSecret: z.string().min(1, { message: "API Secret is required" }),
});

const ConfigPanel = ({ initialValues, onSave, isPending, connectionStatus }: ConfigPanelProps) => {
  // Initialize form
  const form = useForm<z.infer<typeof configSchema>>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      apiUrl: initialValues.apiUrl || "https://demo-crm.frappe.cloud/api",
      apiKey: initialValues.apiKey || "",
      apiSecret: initialValues.apiSecret || "",
    },
  });

  // Form submission handler
  const onSubmit = (data: z.infer<typeof configSchema>) => {
    onSave(data);
  };

  // Update form values when initialValues changes
  useEffect(() => {
    if (initialValues.apiUrl || initialValues.apiKey || initialValues.apiSecret) {
      form.reset({
        apiUrl: initialValues.apiUrl,
        apiKey: initialValues.apiKey,
        apiSecret: initialValues.apiSecret,
      });
    }
  }, [initialValues, form]);

  const getButtonText = () => {
    if (isPending) return "Connecting...";
    if (connectionStatus === ConnectionStatus.CONNECTED) return "Save & Reconnect";
    return "Save & Connect";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="apiUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frappe CRM API URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://your-frappe-instance.com/api" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Enter your API key" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="apiSecret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Secret</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Enter your API secret" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full mt-2"
              disabled={isPending}
            >
              {getButtonText()}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ConfigPanel;
