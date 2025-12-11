"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import CodeBlock from "../code-block";
import Section from "../section";

const FormsSection = () => {
  return (
    <Section
      id="forms"
      title="4. Forms"
      description="Form inputs use soft, distinct edges and a warm, prominent focus ring to guide users. States are clearly differentiated for usability."
    >
      <div className="space-y-8">
        <div>
          <h3 className="text-muted-foreground mb-4 text-sm font-medium">Text Input</h3>
          <div className="space-y-4">
            <div className="grid max-w-md gap-4">
              <div className="space-y-2">
                <Label>Default</Label>
                <Input placeholder="Default" />
              </div>
              <div className="space-y-2">
                <Label>Focus State</Label>
                <Input placeholder="Focus State" autoFocus />
              </div>
              <div className="space-y-2">
                <Label>Error State</Label>
                <Input
                  placeholder="Error State"
                  className="border-error focus-visible:ring-error"
                />
                <p className="text-error text-sm">Could not update your profile.</p>
              </div>
              <div className="space-y-2">
                <Label>Disabled</Label>
                <Input placeholder="Disabled" disabled />
              </div>
            </div>
            <CodeBlock
              code={`import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

<div className="space-y-2">
  <Label>Email</Label>
  <Input placeholder="Enter your email" />
</div>`}
            />
          </div>
        </div>

        <div>
          <h3 className="text-muted-foreground mb-4 text-sm font-medium">
            Select Dropdown
          </h3>
          <div className="space-y-4">
            <div className="grid max-w-md gap-4">
              <div className="space-y-2">
                <Label>Default Option</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Default Option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                    <SelectItem value="option3">Option 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <CodeBlock
              code={`import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>`}
            />
          </div>
        </div>

        <div>
          <h3 className="text-muted-foreground mb-4 text-sm font-medium">Textarea</h3>
          <div className="space-y-4">
            <div className="grid max-w-md gap-4">
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea placeholder="Enter your message..." rows={4} />
              </div>
            </div>
            <CodeBlock
              code={`import { Textarea } from '@/components/ui/textarea'

<Textarea placeholder="Enter your message..." rows={4} />`}
            />
          </div>
        </div>

        <div>
          <h3 className="text-muted-foreground mb-4 text-sm font-medium">Radio Group</h3>
          <div className="space-y-4">
            <div className="max-w-md">
              <RadioGroup defaultValue="option1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option1" id="option1" />
                  <Label htmlFor="option1">Option 1</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option2" id="option2" />
                  <Label htmlFor="option2">Option 2</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option3" id="option3" />
                  <Label htmlFor="option3">Option 3</Label>
                </div>
              </RadioGroup>
            </div>
            <CodeBlock
              code={`import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

<RadioGroup defaultValue="option1">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option1" id="option1" />
    <Label htmlFor="option1">Option 1</Label>
  </div>
</RadioGroup>`}
            />
          </div>
        </div>

        <div>
          <h3 className="text-muted-foreground mb-4 text-sm font-medium">Switch</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="switch" />
              <Label htmlFor="switch">Enable notifications</Label>
            </div>
            <CodeBlock
              code={`import { Switch } from '@/components/ui/switch'

<div className="flex items-center space-x-2">
  <Switch id="switch" />
  <Label htmlFor="switch">Enable notifications</Label>
</div>`}
            />
          </div>
        </div>

        <div>
          <h3 className="text-muted-foreground mb-4 text-sm font-medium">Slider</h3>
          <div className="space-y-4">
            <div className="max-w-md">
              <Slider defaultValue={[50]} max={100} step={1} />
            </div>
            <CodeBlock
              code={`import { Slider } from '@/components/ui/slider'

<Slider defaultValue={[50]} max={100} step={1} />`}
            />
          </div>
        </div>
      </div>
    </Section>
  );
};

export default FormsSection;
