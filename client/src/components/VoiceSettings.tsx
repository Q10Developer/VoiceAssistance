import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { VoiceSettingsType } from "@/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VoiceSettingsProps {
  initialValues: VoiceSettingsType;
  onSave: (data: VoiceSettingsType) => void;
  isPending: boolean;
}

// Voice settings validation schema
const voiceSettingsSchema = z.object({
  voice: z.string(),
  speechRate: z.number().min(0.5).max(2),
  autoListen: z.boolean(),
  soundEffects: z.boolean(),
});

const VoiceSettings = ({ initialValues, onSave, isPending }: VoiceSettingsProps) => {
  // Initialize form
  const form = useForm<z.infer<typeof voiceSettingsSchema>>({
    resolver: zodResolver(voiceSettingsSchema),
    defaultValues: {
      voice: initialValues.voice || "en-US-female",
      speechRate: initialValues.speechRate || 1,
      autoListen: initialValues.autoListen || false,
      soundEffects: initialValues.soundEffects || true,
    },
  });

  // Form submission handler
  const onSubmit = (data: z.infer<typeof voiceSettingsSchema>) => {
    onSave(data);
  };

  // Update form when initial values change
  useEffect(() => {
    form.reset({
      voice: initialValues.voice,
      speechRate: initialValues.speechRate,
      autoListen: initialValues.autoListen,
      soundEffects: initialValues.soundEffects,
    });
  }, [initialValues, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Voice Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="voice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assistant Voice</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a voice" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="en-US-female">English - Female</SelectItem>
                      <SelectItem value="en-US-male">English - Male</SelectItem>
                      <SelectItem value="en-GB-female">English (UK) - Female</SelectItem>
                      <SelectItem value="en-GB-male">English (UK) - Male</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="speechRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Speech Rate</FormLabel>
                  <FormControl>
                    <Slider
                      min={0.5}
                      max={2}
                      step={0.1}
                      value={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                    />
                  </FormControl>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Slower</span>
                    <span>Normal</span>
                    <span>Faster</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="autoListen"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Auto-Listen Mode</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="soundEffects"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Sound Effects</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full mt-4"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save Settings"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default VoiceSettings;
