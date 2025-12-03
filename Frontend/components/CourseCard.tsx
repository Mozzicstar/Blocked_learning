import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Course } from "@/store/slices/coursesSlice";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const isPublished = course.status === 'published' || course.ip_token_id !== null;
  
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="line-clamp-2">{course.title}</CardTitle>
          {isPublished ? (
            <Badge variant="default">On-Chain</Badge>
          ) : (
            <Badge variant="secondary">Draft</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm line-clamp-3">
          {course.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {course.tags?.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          {course.modules?.length || 0} Modules • Creator: {course.creator_wallet?.slice(0, 6)}...{course.creator_wallet?.slice(-4)}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/courses/${course.id}`} className="w-full">
          <Button className="w-full">View Course</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
